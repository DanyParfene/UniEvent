-- Dev-only inspector account for phpMyAdmin (see docker-compose phpmyadmin service).
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'change-me';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
