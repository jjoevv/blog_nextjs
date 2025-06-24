pipeline {
  agent any

  stages {
    stage('Only run on be branch') {
      when {
        expression { env.BRANCH_NAME == 'be' }
      }
      steps {
        echo "✅ This is the 'be' branch. Proceeding with backend build..."
        sh 'echo "Building backend..."'
        sh 'docker build -t hngthaovy/demo-nextappbe ./blog-be'
      }
    }
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
