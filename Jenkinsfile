pipeline {
    agent any

    environment {
        APP_NAME = "frontend-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        COMPOSE_FILE = "docker-compose.yml"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                docker build -t $APP_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Get Previous Version') {
            steps {
                script {
                    sh '''
                    PREV_TAG=$(docker ps -a --filter "name=frontend" --format "{{.Image}}" | cut -d: -f2)
                    echo $PREV_TAG > prev_tag.txt || true
                    echo "Previous version: $PREV_TAG"
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                export APP_NAME=$APP_NAME
                export IMAGE_TAG=$IMAGE_TAG

                docker-compose -f $COMPOSE_FILE up -d --build frontend
                '''
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "Checking frontend..."

                    retry(10) {
                        sleep 5
                        sh 'docker exec nginx curl -f http://frontend'
                    }

                    echo "Frontend is UP"
                }
            }
        }
    }

    post {
        failure {
            echo 'Deployment failed - Rolling back...'

            sh '''
            if [ -f prev_tag.txt ]; then
                PREV_TAG=$(cat prev_tag.txt)

                if [ ! -z "$PREV_TAG" ]; then
                    echo "Rolling back to version: $PREV_TAG"

                    export IMAGE_TAG=$PREV_TAG
                    docker-compose down || true
                    docker-compose up -d
                else
                    echo "No previous version available"
                fi
            else
                echo "prev_tag.txt not found (build failed early)"
            fi
            '''
        }

        success {
            echo 'Deployment successful'
        }

        always {
            echo 'Cleaning unused images'
            sh 'docker image prune -f || true'
        }
    }
}
