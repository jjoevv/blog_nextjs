pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24.3.0'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install Dependencies') {
            steps {
                dir('blog-fe') {
                    echo 'Installing dependencies for lint and test...'
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('blog-fe') {
                    echo '🔍 Running lint...'
                    sh 'npm run lint'
                }
            }
        }

        stage('Test') {
            steps {
                dir('blog-fe') {
                    echo '🧪 Running unit tests...'
                    sh 'npm test'
                }
            }
        }
    }

    post {
        success { echo '✅ frontend pipeline completed successfully.' }
        failure { echo '❌ frontend pipeline failed.' }
        always { cleanWs() }
    }
}
