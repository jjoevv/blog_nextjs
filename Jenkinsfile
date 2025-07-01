
// This Jenkinsfile defines a CI/CD pipeline for a Next.js application with a frontend and backend.
// It includes stages for checking out code, building and pushing Docker images, and deploying or rolling

pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')      // Jenkins Credentials: username & password
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"         // Username for Docker Hub
        DOCKERHUB_PASSWORD = "${DOCKERHUB_CREDENTIALS_PSW}"         // Password for Docker Hub
        TAG = "${env.BUILD_NUMBER}"                                 // Tag for images using Jenkins build number

        USER_SERVER = 'dev'                                         // SSH user on lab server
        SERVER_IP = credentials('LAB_SERVER_IP')                    // Lab server IP from Secret Text Credential

        IMAGE_FE = "${DOCKERHUB_USERNAME}/demo-nextappfe"           // Docker Hub FE image
        IMAGE_BE = "${DOCKERHUB_USERNAME}/demo-nextappbe"           // Docker Hub BE image
    }
    tools {
        nodejs 'NodeJS 24.3.0'
    }
    // Parameters for the pipeline
    parameters {
        booleanParam(
            name: 'ROLLBACK', defaultValue: false, description: 'Tick to rollback instead of deploy'
            )
        string(
            name: 'ROLLBACK_TAG', defaultValue: '', description: 'Image tag to rollback (required if ROLLBACK is true)'
            )
    }

    stages {
        stage('Checkout') { // Checkout the code from SCM
            steps {
                checkout scm // This will checkout the code from the configured SCM (e.g., Git)
            }
        }
        /*
        // Stage to install dependencies for linting and testing
        // This stage will run npm install in both frontend and backend directories
        stage('Install Dependencies') {
            steps {
                dir('blog-fe/my-blog-vite') {
                    echo 'Installing dependencies for lint and test...'
                    sh 'npm install --legacy-peer-deps'
                }
                dir('blog-be') {
                    echo 'Installing dependencies for lint and test...'
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Test') {
            steps {
                dir('blog-be') {
                    echo '🧪 Running backend unit tests...'
                    sh 'npm test'
                }
                dir('blog-fe/my-blog-vite') {
                    echo '🧪 Running unit tests...'
                    sh 'npm test'
                }
            }
        }*/
        // Stage to build and push Docker images
        // Only run this stage if ROLLBACK is false
        stage('Build & Push Images') {
            when {
                expression { !params.ROLLBACK }  // Check if ROLLBACK is false
            }
            steps {
                script {
                    // Ensure Docker is installed and running
                    // Check if Docker is running
                    sh 'docker info || { echo "Docker is not running. Exiting."; exit 1; }'

                    // Login to Docker Hub
                    // Build and push Docker images for frontend and backend
                    // using the credentials stored in Jenkins

                    sh """
                    echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

                    docker build -t $IMAGE_FE:latest -t $IMAGE_FE:$TAG ./blog-fe/my-blog-vite
                    docker build -t $IMAGE_BE:latest -t $IMAGE_BE:$TAG ./blog-be

                    docker push $IMAGE_FE:latest
                    docker push $IMAGE_FE:$TAG

                    docker push $IMAGE_BE:latest
                    docker push $IMAGE_BE:$TAG

                    docker logout
                    """
                }
            }
        }

        // Stage to deploy or rollback the application
        // This stage will run regardless of the ROLLBACK parameter
        // It will either deploy the latest images or rollback to a specified tag
        // Uses SSH to connect to the lab server and manage Docker containers
        // If ROLLBACK is true, it will pull the specified tag and redeploy
        // If ROLLBACK is false, it will pull the latest images and redeploy
        // Uses the credentials stored in Jenkins for SSH access
        // The server IP is stored in a Secret Text Credential
        // The deployment is done using docker-compose to manage the containers
       stage('Deploy or Rollback') {
            steps {
                sshagent(['lab-server-ssh']) { // ✅ Sửa đúng cú pháp
                    script {
                        def deployCommand = """
                            ssh -o StrictHostKeyChecking=no ${USER_SERVER}@${SERVER_IP} '
                                set -e
                                echo "🚀 Starting deployment..."

                                cd /home/dev/nextapp

                                docker-compose pull

                                docker-compose up -d

                                echo "✅ Deployment complete."
                            '
                        """

                        def rollbackCommand = """
                            ssh -o StrictHostKeyChecking=no ${USER_SERVER}@${SERVER_IP} '
                                set -e
                                echo "🔄 Rolling back to tag ${params.ROLLBACK_TAG}..."

                                docker pull ${IMAGE_FE}:${params.ROLLBACK_TAG}
                                docker pull ${IMAGE_BE}:${params.ROLLBACK_TAG}

                                docker tag ${IMAGE_FE}:${params.ROLLBACK_TAG} ${IMAGE_FE}:latest
                                docker tag ${IMAGE_BE}:${params.ROLLBACK_TAG} ${IMAGE_BE}:latest

                                cd /home/dev/nextapp

                                docker-compose up -d

                                echo "✅ Rollback complete."
                            '
                        """

                        if (params.ROLLBACK) {
                            if (!params.ROLLBACK_TAG) {
                                error('❌ ROLLBACK_TAG is required when ROLLBACK is true.')
                            }
                            echo "🔄 Executing rollback to tag ${params.ROLLBACK_TAG}..."
                            sh rollbackCommand
                        } else {
                            echo "🚀 Executing deployment of latest images..."
                            sh deployCommand
                        }
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
    }
}