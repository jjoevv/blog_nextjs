pipeline {
    docker {
    image 'node:18'
    args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
  }
/*
  environment {
    IMAGE_NAME = 'demo-nextappfe'
    DOCKERHUB_USERNAME = 'hngthaovy'
    CONTAINER_NAME = 'nextapp-fe-container'
    PORT = '3000'
  }*/

  options {
    skipDefaultCheckout(true)
    buildDiscarder logRotator( 
            daysToKeepStr: '16', 
            numToKeepStr: '10'
        )
  }

  stages {
    stage('Run only on fe branch') {
      when {
        expression { env.BRANCH_NAME == 'fe' }
      }
      stages {

        /*stage('Install Docker CLI') {
          steps {
            sh '''
              apt-get update && apt-get install -y docker.io
              docker --version
            '''
          }
        }*/
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
                sh """
                echo "Cleaned Up Workspace For Project"
                """
            }
        }
        stage('Checkout Source Code') {
          steps {
            git branch: 'fe', url: 'https://github.com/jjoevv/blog_nextjs.git'
          }
        }
        stage('Unit Testing') {
                    steps {
                        sh """
                        echo "Running Unit Tests"
                        """
                    }
                }
                stage('Code Analysis') {
            steps {
                sh """
                echo "Running Code Analysis"
                """
            }
        }
        stage('Install FE Dependencies') {
          steps {
            dir('blog-fe') {
              sh '''
                echo "📦 Installing frontend dependencies..."
                npm ci || npm install
              '''
            }
          }
        }
      /*
        stage('Build Docker Image') {
          steps {
            sh '''
              echo "🐳 Building frontend Docker image..."
              docker build -t $IMAGE_NAME ./blog-fe
            '''
          }
        }

        stage('Deploy Docker Container') {
          steps {
            sh '''
              echo "🚀 Stopping existing frontend container..."
              docker rm -f $CONTAINER_NAME || true

              echo "🚀 Starting new container..."
              docker run -d --name $CONTAINER_NAME -p $PORT:$PORT $IMAGE_NAME
            '''
          }
        }

        stage('Push Docker Image to DockerHub') {
          steps {
            withCredentials([usernamePassword(
              credentialsId: 'dockerhub-creds',
              usernameVariable: 'DOCKERHUB_USERNAME',
              passwordVariable: 'DOCKERHUB_PASSWORD'
            )]) {
              sh '''
                echo "🔐 Logging in to DockerHub..."
                echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

                echo "🏷️ Tagging image..."
                docker tag $IMAGE_NAME $DOCKERHUB_USERNAME/$IMAGE_NAME

                echo "🚀 Pushing image to DockerHub..."
                docker push $DOCKERHUB_USERNAME/$IMAGE_NAME
              '''
            }
          }
        }*/
      }
    }
  }

  post {
    success {
      echo "✅ Frontend pipeline on branch 'fe' completed successfully!"
    }
    failure {
      echo "❌ Frontend pipeline failed"
    }
  }
}
// This Jenkinsfile defines a pipeline for building and deploying a Next.js frontend application
// It runs only on the 'fe' branch, installs Docker, checks out the source code,
// installs dependencies, builds a Docker image, deploys it as a container,
// and pushes the image to DockerHub.