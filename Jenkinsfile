pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24.3.0' // Ensure this matches the Node.js version installed in Jenkins
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install Dependencies') {
            steps {
                dir('blog-be') {
                    echo '📦 Installing dependencies for lint and test...'
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }
        /*
        stage('Lint') {
            steps {
                dir('blog-be') {
                    echo '🔍 Running lint...'
                    sh 'npm run lint'
                }
            }
        }*/

        stage('Test') {
            steps {
                dir('blog-be') {
                    echo '🧪 Running unit tests...'
                    sh 'npm test'
                }
            }
        }
    }

    post {
        success { echo '✅ backend pipeline completed successfully.' }
        failure { echo '❌ backend pipeline failed.' }
        always { cleanWs() }
    }
}
