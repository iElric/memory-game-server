defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  #TODO: check if the game function works correctly

  # find a template called game.html and render it
  def game(conn, %{"game" => game}) do
    render conn, "game.html", game: game
  end

  def index(conn, _params) do
    render conn, "index.html"
  end
end
