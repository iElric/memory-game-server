defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  # reference to nat's notes

  # "games:" <> name will match any string start with "games" and assign rest to name
  # Definition of: payload (1) The "actual data" in a packet or file minus all headers attached for transport and minus
  # all descriptive meta-data. In a network packet, headers are appended to the payload for transport and then discarded
  # at their destination.
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      #game = BackupAgent.get(name) || Game.new()

      socket = socket
               |> assign(:game, game)
               |> assign(:name, name)
      #BackupAgent.put(name, game)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # call click
  def handle_in("click", %{"index" => ii}, socket) do
    # Adds key/value pair to socket assigns
    # “Assigns” is basically the data backpack of the socket or Plug.Conn connection. You’d use it to hold onto data,
    # which you’ll need throughout the lifetime of that connection.
    name = socket.assigns[:name]
    game = Game.click(socket.assigns[:game], ii)
    socket = assign(socket, :game, game)
    #BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # call reverse_mismatch
  # notice handle_in is handle_in/3
  def handle_in("mismatch", _, socket) do
    name = socket.assigns[:name]
    game = Game.reverse_mismatch(socket.assigns[:game])
    socket = assign(socket, :game, game)
    #BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # call restart
  # notice handle_in is handle_in/3
  def handle_in("restart", nil, socket) do
    name = socket.assigns[:name]
    game = Game.new()
    socket = assign(socket, :game, game)
    #BackupAgent.put(name, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

end
