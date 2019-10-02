defmodule MemoryWeb.Router do
  use MemoryWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", MemoryWeb do
    pipe_through :browser # Use the default browser stack

    # call the game function in page_controller.ex, notice we use an atom :game in the path.
    # Phoenix will take whatever value that appears in that position in the URL and pass a Map with the key game
    # pointing to that value to the controller.
    # if if we point the browser at: http://localhost:4000/hello/Frank, the value of ":game" will be "Frank".
    get "/game/:game", PageController, :game
    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", MemoryWeb do
  #   pipe_through :api
  # end
end
