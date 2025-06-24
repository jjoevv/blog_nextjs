pipeline {
  agent {
    docker {
      image 'node:18'
      args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    HOME = '/home/node'
    NPM_CONFIG_CACHE = '/home/node/.npm'
    IMAGE_NAME = 'my-app'
    CONTAINER_NAME = 'my-app-container'
    PORT = '3000'
  }

  stages {
    stage('Run only on main') {
      when {
        expression { env.BRANCH_NAME == 'main' }
      }
      stages {
        stage('Setup Docker CLI') {
          steps {
            sh '''
              apt-get update || { echo "Failed to update apt"; exit 1; }
              apt-get install -y docker.io || { echo "Failed to install docker.io"; exit 1; }
              docker --version || { echo "Docker CLI not working"; exit 1; }
            '''
          }
        }

        stage('Checkout') {
          steps {
            git branch: 'main', url: 'https://github.com/jjoevv/blog_nextjs.git'
          }
        }

        stage('Install Dependencies') {
          steps {
            sh '''
              echo "Cleaning npm cache..."
              npm cache clean --force
              echo "Installing packages..."
              npm ci --cache $NPM_CONFIG_CACHE
            '''
          }
        }

        stage('Build Docker Image') {
          steps {
            sh '''
              echo "🐳 Building Docker image..."
              docker build -t $IMAGE_NAME .
            '''
          }
        }

        stage('Deploy Docker Container') {
          steps {
            sh '''
              echo "🚀 Stopping old container (if exists)..."
              docker rm -f $CONTAINER_NAME || true
              echo "🚀 Checking port $PORT..."
              docker ps -q --filter "publish=$PORT" && docker rm -f $(docker ps -q --filter "publish=$PORT") || true
              echo "🚀 Starting new container..."
              docker run -d --name $CONTAINER_NAME -p $PORT:$PORT $IMAGE_NAME
            '''
          }
        }

        stage('Push Docker Image') {
          steps {
            withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
              sh '''
                echo "🔐 Logging in to DockerHub..."
                echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

                echo "📦 Tagging image..."
                docker tag $IMAGE_NAME $DOCKERHUB_USERNAME/$IMAGE_NAME

                echo "🚀 Pushing image to DockerHub..."
                docker push $DOCKERHUB_USERNAME/$IMAGE_NAME
              '''
            }
          }
        }

      }
    }
  }

  post {
    success {
      echo "✅ App is running"
    }
    failure {
      echo "❌ Build failed"
    }
  }
}
