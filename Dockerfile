FROM python:3

WORKDIR /app

COPY . .

CMD ["/usr/bin/python3", "-m", "http.server"]

