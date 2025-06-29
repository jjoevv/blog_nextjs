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

    parameters {
        booleanParam(name: 'ROLLBACK', defaultValue: false, description: 'Tick to rollback instead of deploy') // Parameter to decide if we are rolling back
        string(name: 'ROLLBACK_TAG', defaultValue: '', description: 'Image tag to rollback (required if ROLLBACK is true)') // Tag to rollback to, required if ROLLBACK is true
    }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'be', url: 'https://github.com/jjoevv/blog_nextjs.git' // nhánh be
      }
    }

    stage('Install dependencies') {
      steps {
        dir('blog-be') {
          sh '''
            npm install
          '''
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh '''
            echo "🐳 Building backend Docker image..."
            docker build -t $BACKEND_IMAGE ./blog-be
          '''
        }
      }
    }

    stage('Push to DockerHub') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "🔐 Logging in to DockerHub..."
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $BACKEND_IMAGE
          '''
        }
      }
    }

    // Optional: Run container locally
    // stage('Deploy') {
    //   steps {
    //     sh '''
    //       docker rm -f $CONTAINER_NAME || true
    //       docker run -d --name $CONTAINER_NAME -p $PORT:$PORT $BACKEND_IMAGE
    //     '''
    //   }
    // }
  }

  post {
    success {
      echo "✅ Backend pipeline completed!"
    }
    failure {
      echo "❌ Backend pipeline failed."
    }
  }
}
// Note: Replace 'yourdockerhubuser' with your actual Docker Hub username.