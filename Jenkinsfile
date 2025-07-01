pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies for lint and test...'
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Running lint...'
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running unit tests...'
                sh 'npm test'
            }
        }
    }

    post {
        success { echo '✅ backend pipeline completed successfully.' }
        failure { echo '❌ backend pipeline failed.' }
        always { cleanWs() }
    }
}
