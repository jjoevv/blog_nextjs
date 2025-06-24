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
    IMAGE_NAME = 'demo-nextappbe'
    CONTAINER_NAME = 'nextapp-be-container'
    PORT = '4000' // nếu backend chạy port khác, sửa tại đây
  }

  stages {

    stage('Ensure running only on be branch') {
      when {
        expression { env.BRANCH_NAME == 'be' }
      }
      steps {
        echo "🟢 Running backend pipeline on branch: ${env.BRANCH_NAME}"
      }
    }

    stage('Install Docker CLI') {
      steps {
        sh '''
          apt-get update && apt-get install -y docker.io
        '''
      }
    }

    stage('Checkout') {
      steps {
        git branch: 'be', url: 'https://github.com/jjoevv/blog_nextjs.git'
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir('blog-be') {
          sh '''
            echo "📦 Installing backend dependencies..."
            npm ci || npm install
          '''
        }
      }
    }

    stage('Build Backend Docker Image') {
      steps {
        sh '''
          echo "🐳 Building Docker image..."
          docker build -t $IMAGE_NAME ./blog-be
        '''
      }
    }

    stage('Push Image to DockerHub') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockerhub-creds',
            usernameVariable: 'DOCKERHUB_USERNAME',
            passwordVariable: 'DOCKERHUB_PASSWORD'
          )
        ]) {
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
    }
  }

  post {
    success {
      echo "✅ Backend image pushed successfully!"
    }
    failure {
      echo "❌ Something went wrong in the backend pipeline"
    }
  }
}
