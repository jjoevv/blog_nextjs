pipeline {
  agent {
    docker {
      image 'node:18'
      args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    BACKEND_IMAGE = 'hngthaovy/demo-nextappbe'    // ← Thay tên image DockerHub của bạn
    CONTAINER_NAME = 'backend-app'
    PORT = '5000'                                  // ← Cổng backend nếu có
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'      // ← ID của Jenkins credential chứa DockerHub user/pass
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
            docker build -t $BACKEND_IMAGE ./backend
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
