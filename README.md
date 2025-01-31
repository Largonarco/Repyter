# Repyter

A Jupyter Notebook Protoype in React

## Project Structure

The project is organized into several core components:

```
src/
|-- components/
| |-- FileList.tsx
| |-- FileEditor.tsx
| |-- CodeCell.tsx
|-- pages/
| |-- Notebook.tsx
|-- hooks/
| |-- useNotebook.ts  # Zustand Store and helper hooks
|-- services/
| |-- api.ts          # Backend Helpers
|-- App.tsx
|-- main.tsx
```

## Installation and Setup

This project makes use of JupyterHub as the backend, so it requires JupyterHub.

### JupyterHub Setup

1.  Run JupyterHub via Docker Compose

        ```
        git clone https://github.com/jupyterhub/jupyterhub-deploy-docker.git
        cd jupyterhub-deploy-docker/basic-example
        docker-compose up
        ```

2.  Access JupyterHub

- Open your browser and navigate to [sign up page](http://localhost:8000/hub/signup)
- Create an admin user; make sure username remain admin
- After logging in, navigate to the [Token](http://localhost:8000/hub/token) page to generate an authentication token for further use.
- Use this token in _src/services/api.ts_ as "JUPYTERHUB_API_TOKEN"

After setting up JupyterHub as the backend, just run it like a normal React app

### Repyter Setup

```
yarn
yarn dev
```

After all this, use the app at http://localhost:5173
