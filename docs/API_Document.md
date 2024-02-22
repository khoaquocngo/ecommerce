# Access APIs

- `x-api-key`: Admin will provide it
- `x-client-id`: ID of shops collection

## Sign Up

- URL

  ```text
  /v1/api/shop/signUp
  ```

- Method: `POST`

- Headers

  ```js
  {
    "x-api-key": String
  }
  ```

- Body

  ```js
  {
    email: String,
    password: String
  }
  ```

- Response

  ```js
  {
    message: String,
    status: Number,
    metadata: {
      shop: {
        _id: String,
        email: String,
      },
    },
    tokens: {
        accessToken: String,
        refreshToken: String,
    }
  }
  ```

- Workflow
  - ![SignUp drawio](https://github.com/khoaquocngo/ecommerce/assets/56310352/9721c7fb-0142-4d16-be04-ce03a235579f)

## Sign In

- URL

  ```text
  /v1/api/shop/signIn
  ```

- Method: `POST`

- Headers

  ```js
  {
    "x-api-key": String
  }
  ```

- Body

  ```js
  {
    email: String,
    password: String,
  }
  ```

- Response

  ```js
  {
    message: String,
    status: Number,
    metadata: {
      shop: {
        _id: String,
        email: String,
      }
      token: {
        accessToken: String,
        refreshToken: String,
      }
    }
  }
  ```

- Workflow

## Sign Out

- URL

  ```text
  /v1/api/shop/signOut
  ```

- Method: `POST`

- Headers

  ```js
  {
    "x-api-key": String,
    "x-client-id": String,
    "refresh-token": String,
  }
  ```

- Response

  ```js
  {
    message: String,
    status: Number,
  }
  ```

## Refresh Token

- URL

  ```text
  /v1/api/shop/refreshToken
  ```

- Method: `POST`

- Headers

  ```js
  {
    "x-api-key": String,
    "x-client-id": String,
    "refresh-token": String,
  }
  ```

- Response

  ```js
  {
    message: String,
    status: Number,
    metadata: {
      shop: {
        _id: String,
        email: String,
      },
    },
    tokens: {
        accessToken: String,
        refreshToken: String,
    }
  }
  ```
