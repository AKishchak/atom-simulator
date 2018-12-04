FROM nginx:latest

ADD ./dist /var/www/atom
ADD ./nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80