pipeline {
  agent any  // Không dùng container

  stages {
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t hngthaovy/demo-nextappbe ./blog-be'
      }
    }
  }
}
