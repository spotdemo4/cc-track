FROM node:21

# # Define environment variables
ARG JWT_SECRET
ARG PLAID_CLIENT_ID
ARG PLAID_SECRET
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASS
ARG DB_NAME
ENV JWT_SECRET $JWT_SECRET
ENV PLAID_CLIENT_ID $PLAID_CLIENT_ID
ENV PLAID_SECRET $PLAID_SECRET
ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_USER $DB_USER
ENV DB_PASS $DB_PASS
ENV DB_NAME $DB_NAME

# Install node dependencies
WORKDIR /svelte
COPY ./package.json .
COPY ./svelte.config.js .
RUN npm install

# Move to container
COPY . .

# Build for production
RUN npm run build

# Launch app
CMD ["node", "build"]
EXPOSE 3000