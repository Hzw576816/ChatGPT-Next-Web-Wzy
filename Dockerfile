FROM node:18-alpine AS base
# 创建目录
WORKDIR /app

COPY publish/public ./public
COPY publish/standalone ./
COPY publish/static ./.next/static
COPY publish/server ./.next/server

ENV PROXY_URL=""
ENV OPENAI_API_KEY=""
ENV CODE=""
ENV HIDE_USER_API_KEY=1
ENV HIDE_BALANCE_QUERY=1

EXPOSE 3000

CMD if [ -n "$PROXY_URL" ]; then \
        export HOSTNAME="127.0.0.1"; \
        protocol=$(echo $PROXY_URL | cut -d: -f1); \
        host=$(echo $PROXY_URL | cut -d/ -f3 | cut -d: -f1); \
        port=$(echo $PROXY_URL | cut -d: -f3); \
        conf=/etc/proxychains.conf; \
        echo "strict_chain" > $conf; \
        echo "proxy_dns" >> $conf; \
        echo "remote_dns_subnet 224" >> $conf; \
        echo "tcp_read_time_out 15000" >> $conf; \
        echo "tcp_connect_time_out 8000" >> $conf; \
        echo "localnet 127.0.0.0/255.0.0.0" >> $conf; \
        echo "localnet ::1/128" >> $conf; \
        echo "[ProxyList]" >> $conf; \
        echo "$protocol $host $port" >> $conf; \
        cat /etc/proxychains.conf; \
        proxychains -f $conf node server.js; \
    else \
        node server.js; \
    fi
#docker build -t chatgpt-next-web-wzy .
#docker run -d -p 8016:3000  -e BASE_URL="http://39.104.53.56:8015/api"  chatgpt-next-web-wzy
