# Football API



## Description

[David Kotlirevsky](https://www.linkedin.com/in/dkotlirevsky) App football Api

### How this App was developed:

* First was a challenge about learning graphql, so I started with an example project and local
  instances to knowing how to interact and understand if nest js (Framework I use to work with) suits ok
  for that purpose
  * Understand what is a Mutation and Query,
  * How framework use them
  * Entities related
  * How to interact with postman

* Once completed previous step I dig into the football-api, and based on you specifications
  try to find out mocked instances so I can use them for the sake of testing

* Create the project, entities, initial migrations and configurations

* As I have mocks , I can mock external API and doing TDD I starting doing the test and solving the problems
  * Create the test and moving forward with them
  * Start for create league mutation
  * Make it work then running local with postman

Through this step I have the opportunity to fix DB relations
* the previous step was repeated with players and teams
* Make the project run as independent container through docker compose.
  * Fix configurations
  * Try documentations and enhance it

### Disclaimer:
* First time doing an API with Graphql.
* I choose nest js as framework because its clarity related to architecture
  design and clean way of interacting with ORM and Graphql
* .env files added into repository for the sake of this test.
  Shouldn't be added in real world app.
* Environment and development tools
  * OS: Mac OS Monterrey
  * IDE: Webstorm ( Jetbrains )
  * Postman
  * Docker Desktop tool
  * yarn ( v1.22.17 )

### how to run it local

* Preconditions:
  * have installed locally yarn
  * have installed locally docker and docker compose
  * Add Into .env.local you added the token provided by football-api org 
    * Assign it to `API_FOOTBALL_TOKEN`
  * There are no other app using 3000 or 5432 ports

* Step into the root folder of project
  ```
  cd <your_dev_folder>/football-api

* Run yarn to install dependencies and build
  ```
  yarn 
  yarn build
  ```

* Create containers/download images
  ```
  yarn docker-compose:api-up:local

* create tables for DB
  ####  for running tests
  yarn migration:run:test
  ####  local environment
  yarn migration:run:local

* If everything ok within a browser you'll see me saying hello! throw `http://localhost:3000`
or just :
```
curl -X GET "http://localhost:3000"
> Hi there , thanks for starting Football-api, created by David G. Kotlirevsky
```

* Which endpoints through Graphql ( with example )

  * You can go through postman through `http://localhost:3000/graphql`

    * Loading data ( Mutation )
    ```
     mutation createLeague {
        importLeague( leagueCode: "PL"){
          code
        }
     }
    ```
    * players without teamName
    ```
     {
          players ( criteria: {leagueCode: "PL" }) {
              name
              position
              dateOfBirth // or any field fo
          }
       }
    ```
    * players with teamName
    ```
     {
          players ( criteria: {leagueCode: "PL", teamName: "Arsenal FC" }) {
              name
              position
              dateOfBirth // or any field fo
          }
       }
    ```
    * coaches without teamName
    ```
     {
          coaches ( criteria: {leagueCode: "PL" }) {
              name
              dateOfBirth // or any field fo
          }
       }
    ```
    * coaches with teamName
    ```
     {
          coaches ( criteria: {leagueCode: "PL", teamName: "Arsenal FC" }) {
              name
              dateOfBirth // or any field fo
          }
       }
    ```

    * team
      ```
      {
          team ( name: "Arsenal FC") {
              name // or other team fields
              players {
                ...fields of player
              }
              // if team has no player will be loaded here only with coaches
              coaches {
                ...fields of player
              }
          }
      }
    ```

## For running test stop football container

```
docker stop football

```

* Run tests
```
yarn test
```


* run app locally within debug mode ( first turn off the container )
  ```
  yarn start:debug:local
  ```


