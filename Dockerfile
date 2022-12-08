FROM public.ecr.aws/docker/library/node:16.13.0-alpine3.14 as node
FROM public.ecr.aws/docker/library/alpine:latest
WORKDIR /usr/src/app
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin
COPY . ./
RUN apk add yarn
RUN apk update
RUN yarn
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
