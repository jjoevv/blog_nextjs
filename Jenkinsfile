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

    // Frontend
    FE_DIR = 'blog-fe'
    FE_IMAGE = 'demo-nextappfe'
    FE_CONTAINER = 'frontend-container'
    FE_PORT = '3000'

    // Backend
    BE_DIR = 'blog-be'
    BE_IMAGE = 'demo-nextappbe'
    BE_CONTAINER = 'backend-container'
    BE_PORT = '4000'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/jjoevv/blog_nextjs.git'
      }
    }
    stage('Install Docker CLI') {
      steps {
        sh '''
          apt-get update
          apt-get install -y docker.io
          docker --version
        '''
      }
    }

    // Frontend Build & Deploy
    stage('Build & Deploy Frontend') {
      steps {
        dir("${FE_DIR}") {
          sh '''
            echo "📦 Installing frontend dependencies..."
            npm install

            echo "⚙️ Building frontend..."
            npm run build
          '''

          sh '''
            echo "🐳 Building FE Docker image..."
            docker build -t $FE_IMAGE .

            echo "🛑 Stopping old FE container..."
            docker rm -f $FE_CONTAINER || true

            echo "🚀 Running FE container..."
            docker run -d --name $FE_CONTAINER -p $FE_PORT:$FE_PORT $FE_IMAGE
          '''
        }
      }
    }

    // Backend Build & Deploy
    stage('Build & Deploy Backend') {
      steps {
        dir("${BE_DIR}") {
          sh '''
            echo "📦 Installing backend dependencies..."
            npm install

            echo "⚙️ Building backend..."
            npm run build || echo "Skipping build if not defined"
          '''

          sh '''
            echo "🐳 Building BE Docker image..."
            docker build -t $BE_IMAGE .

            echo "🛑 Stopping old BE container..."
            docker rm -f $BE_CONTAINER || true

            echo "🚀 Running BE container..."
            docker run -d --name $BE_CONTAINER -p $BE_PORT:$BE_PORT $BE_IMAGE
          '''
        }
      }
    }

    // Push both images to DockerHub
    stage('Push to DockerHub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
          sh '''
            echo "🔐 Logging in to DockerHub..."
            echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

            echo "📤 Tagging and pushing FE image..."
            docker tag $FE_IMAGE $DOCKERHUB_USERNAME/$FE_IMAGE
            docker push $DOCKERHUB_USERNAME/$FE_IMAGE

            echo "📤 Tagging and pushing BE image..."
            docker tag $BE_IMAGE $DOCKERHUB_USERNAME/$BE_IMAGE
            docker push $DOCKERHUB_USERNAME/$BE_IMAGE
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ Frontend & Backend deployed successfully!"
    }
    failure {
      echo "❌ Build failed!"
    }
  }
}
// This Jenkinsfile defines a CI/CD pipeline for a Next.js application with both frontend and backend components.
// It builds Docker images for both components, runs them in containers, and pushes the images to DockerHub.
// The pipeline includes stages for checking out the code, building and deploying the frontend and backend, and pushing the images to DockerHub.