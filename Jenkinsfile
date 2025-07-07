
// This Jenkinsfile defines a CI/CD pipeline for a Next.js application with a frontend and backend.
// It includes stages for checking out code, building and pushing Docker images, and deploying or rolling

pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')      // Jenkins Credentials: username & password
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"         // Username for Docker Hub
        DOCKERHUB_PASSWORD = "${DOCKERHUB_CREDENTIALS_PSW}"         // Password for Docker Hub
        TAG = "build-${env.BUILD_NUMBER}"                                 // Tag for images using Jenkins build number

        USER_SERVER = 'dev'                                         // SSH user on lab server
        SERVER_IP = credentials('LAB_SERVER_IP')                    // Lab server IP from Secret Text Credential
        
        TARGET_PATH = '/home/dev/nextapp/'                          // Target path on the lab server
        IMAGE_FE = "${DOCKERHUB_USERNAME}/demo-nextappfe"           // Docker Hub FE image
        IMAGE_BE = "${DOCKERHUB_USERNAME}/demo-nextappbe"           // Docker Hub BE image
    }
    /*
    tools {
        nodejs 'NodeJS 24.3.0'
    }*/
    // Parameters for the pipeline
    parameters {
        booleanParam(
            name: 'ROLLBACK', defaultValue: false, description: 'Tick to rollback instead of deploy'
            )
        string(
            name: 'ROLLBACK_TAG', defaultValue: '', description: 'Image tag to rollback (required if ROLLBACK is true)'
            )
        booleanParam(
            name: 'SKIP_PUSH_IMAGE', defaultValue: false, description: 'Tick to skip pushing Docker images to Docker Hub'
            )
        booleanParam(
            name: 'SKIP_BUILD_IMAGE', defaultValue: true, description: 'Tick to skip building Docker images'
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
        // Stage to build Docker images
        stage('Build Docker Images') {
            when {
                expression { !params.ROLLBACK && !params.SKIP_BUILD_IMAGE }
            }
            steps {
                script {
                    sh 'docker info || { echo "Docker is not running. Exiting."; exit 1; }'

                    echo "🛠 Building Docker images for frontend and backend..."

                    sh """
                    docker build -t $IMAGE_FE:latest -t $IMAGE_FE:$TAG ./blog-fe/my-blog-vite
                    docker build -t $IMAGE_BE:latest -t $IMAGE_BE:$TAG ./blog-be
                    """
                }
            }
        }

        // Stage to push Docker images
        stage('Push Docker Images') {
            when {
                expression { !params.ROLLBACK && !params.SKIP_PUSH_IMAGE && !params.SKIP_BUILD_IMAGE }
            }
            steps {
                script {
                    echo "🚀 Pushing Docker images to Docker Hub..."

                    sh """
                    echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

                    docker push $IMAGE_FE:latest
                    docker push $IMAGE_FE:$TAG

                    docker push $IMAGE_BE:latest
                    docker push $IMAGE_BE:$TAG

                    docker logout
                    """
                }
            }
        }

        // Stage to clean up dangling Docker images
        stage('Cleanup After Build') {
            steps {
                script {
                    echo "🧹 Cleaning up dangling Docker images again after build..."
                    sh 'docker system prune -af'
                    sh 'docker image prune -f'  
                    sh 'docker volume prune -f'
                    sh 'docker container prune -f'
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
        // The deployment is done using docker compose to manage the containers
       stage('Deploy or Rollback') {
            steps {
                sshagent(['vps-ssh']) { 
                    script {
                        def envMap = readProperties file: '.env'
                        // Ensure the docker-compose.yml file is present in the workspace
                        if (!fileExists('docker-compose.yml') || !fileExists('prometheus.yml')) {
                            error('❌ docker-compose.yml or prometheus file not found in the workspace. Please ensure it exists.')
                        } else  {
                            script {
                                def copySuccess = false
                                
                                // Try IP LAN
                                try {
                                    echo "Trying to copy via IP LAN "
                                    sh """
                                    
                                        mkdir -p /home/dev/nextapp 

                                        scp -o ConnectTimeout=20 -o StrictHostKeyChecking=no docker-compose.yml ${USER_SERVER}@${SERVER_IP}:${TARGET_PATH}docker-compose.yml
                                        scp -o ConnectTimeout=20 -o StrictHostKeyChecking=no prometheus.yml ${USER_SERVER}@${SERVER_IP}:${TARGET_PATH}prometheus.yml
                                        scp -o ConnectTimeout=20 -o StrictHostKeyChecking=no prometheus.template.yml ${USER_SERVER}@${SERVER_IP}:${TARGET_PATH}prometheus.template.yml

                                    """

                                    echo "✅ Copied via IP LAN successfully."
                                    copySuccess = true
                                } catch (err) {
                                    echo "⚠️ Failed to copy via IP LAN (${SERVER_IP})... ${err.getMessage()}"
                                }


                                // If all fail, fail the pipeline
                                if (!copySuccess) {
                                    error("Connect failed. Please check the server IP and SSH credentials.")
                                }
                            }
                        }
                       
                        def jenkinsHost = envMap.JENKINS_HOST

                                export JENKINS_HOST=${jenkinsHost}
                                envsubst < prometheus.template.yml > prometheus.yml
                        def deployCommand = """
                            ssh -o StrictHostKeyChecking=no ${USER_SERVER}@${SERVER_IP} '
                                set -e
                                echo "🚀 Starting deployment..."

                                mkdir -p /home/dev/nextapp &&
                                cd /home/dev/nextapp &&

                                docker compose pull
                                docker compose down
                                docker compose up -d

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

                                mkdir -p /home/dev/nextapp &&
                                cd /home/dev/nextapp &&

                                docker compose down

                                docker compose up -d

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
                            sh 'echo "🚀 Executing deployment with latest images... "'
                            sh deployCommand
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            githubNotify context: 'DemoCICD', status: 'SUCCESS', description: 'Pipeline passed'
        }
        failure {
            githubNotify context: 'DemoCICD', status: 'FAILURE', description: 'Pipeline failed'
        }
        always {
            cleanWs()
        }
    }
}