pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // Jenkins Credentials (username & password)
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_PASSWORD = "${DOCKERHUB_CREDENTIALS_PSW}"
        IMAGE_FE = "${DOCKERHUB_USERNAME}/demo-nextappfe"
        IMAGE_BE = "${DOCKERHUB_USERNAME}/demo-nextappbe"
        TAG = "${env.BUILD_NUMBER}"
    }

    parameters {
        booleanParam(name: 'ROLLBACK', defaultValue: false, description: 'Tick to rollback instead of deploy')
        string(name: 'ROLLBACK_TAG', defaultValue: '', description: 'Image tag to rollback (required if ROLLBACK is true)')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Push Images') {
            when {
                expression { return !params.ROLLBACK }
            }
            steps {
                script {
                    sh """
                    echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

                    docker build -t $IMAGE_FE:latest -t $IMAGE_FE:$TAG ./frontend
                    docker build -t $IMAGE_BE:latest -t $IMAGE_BE:$TAG ./backend

                    docker push $IMAGE_FE:latest
                    docker push $IMAGE_FE:$TAG

                    docker push $IMAGE_BE:latest
                    docker push $IMAGE_BE:$TAG

                    docker logout
                    """
                }
            }
        }

        stage('Deploy or Rollback') {
            steps {
                script {
                    if (params.ROLLBACK) {
                        if (!params.ROLLBACK_TAG) {
                            error("ROLLBACK_TAG is required when ROLLBACK is true.")
                        }

                        sh """
                        ssh user@yourserver "
                            echo '🔄 Rolling back to tag ${params.ROLLBACK_TAG}...'

                            docker pull $IMAGE_FE:${params.ROLLBACK_TAG}
                            docker pull $IMAGE_BE:${params.ROLLBACK_TAG}

                            docker tag $IMAGE_FE:${params.ROLLBACK_TAG} $IMAGE_FE:latest
                            docker tag $IMAGE_BE:${params.ROLLBACK_TAG} $IMAGE_BE:latest

                            cd /path/to/project &&
                            docker-compose up -d

                            echo '✅ Rollback complete.'
                        "
                        """
                    } else {
                        sh """
                        ssh user@yourserver "
                            echo '🚀 Deploying latest images...'

                            docker pull $IMAGE_FE:latest
                            docker pull $IMAGE_BE:latest

                            cd /path/to/project &&
                            docker-compose up -d

                            echo '✅ Deployment complete.'
                        "
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully.'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
        always {
            cleanWs()
        }
    }
}
