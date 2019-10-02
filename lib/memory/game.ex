defmodule Memory.Game do
  # new a game state
  def new do
    %{
      tiles: init_tiles(),
      num_guesses: 0,
      prev_click_index: -1,
      # use mismatch to store the mismatched tiles
      mismatch: nil
    }
  end

  def init_tiles do
    ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"]
    |> # map every tile in tiles from a string to a map(tile map)
       Enum.map(fn (tile) -> %{"value" => tile, "is_visible" => false, "is_clickable" => true} end)
    |> # shuffle this list of maps
       Enum.shuffle()
    |> # create a list of tuples
       Enum.with_index()
    |> # reverse the order in every tuple
       Enum.map(fn ({tile_map, index}) -> {index, tile_map} end)
    |> # convert list of tuples into a map with index number as key, tile map as value
       # now is a map of map
       Map.new()
  end

  def click(game, index) do
    check_index(index)
    %{
      tiles: game_tiles,
      num_guesses: game_num_guesses,
      prev_click_index: game_prev_click_index,
      mismatch: game_mismatch
    } = game
    %{
      "value" => value,
      "is_visible" => is_visible,
      "is_clickable" => is_clickable
    } = game_tiles[index]
    # first guesses
    if is_clickable && game_mismatch === nil do
      # change this tile visible and not clickable, + 1 for number of guesses
      is_visible = true
      is_clickable = false
      game_num_guesses = game_num_guesses + 1
      # update the corresponding tile
      tile = game_tiles[index]
             |> Map.put("is_visible", is_visible)
             |> Map.put("is_clickable", is_clickable)
      # update game tiles
      game_tiles = game_tiles
                   |> Map.put(index, tile)
      # update game
      game = game
             |> Map.put(:tiles, game_tiles)
             |> Map.put(:num_guesses, game_num_guesses)
      if is_first_guess?(game_prev_click_index) do
        game_prev_click_index = index
        game
        |> Map.put(:prev_click_index, game_prev_click_index)
      else
        #TODO:simply duplicate code here, use temp to store game_prev_click_index
        # second guesses
        if value === game_tiles[game_prev_click_index]["value"] do
          # if two clicks match
          game_prev_click_index = -1
          game
          |> Map.put(:prev_click_index, game_prev_click_index)
        else
          # if two clicks don't match
          # store these two indexes for later reverse
          game_mismatch = {game_prev_click_index, index}
          game_prev_click_index = -1
          game
          |> Map.put(:prev_click_index, game_prev_click_index)
          |> Map.put(:mismatch, game_mismatch)
        end
      end
    else
      game
    end
  end

  # reverse the mismatch tiles
  def reverse_mismatch(game) do
    if game.mismatch !== nil do
      %{
        tiles: game_tiles,
        mismatch: {index_1, index_2}
      } = game
      # make index_1 and index_2 both invisible and clickable
      tile_1 = game_tiles[index_1]
               |> Map.put("is_visible", false)
               |> Map.put("is_clickable", true)
      tile_2 = game_tiles[index_2]
               |> Map.put("is_visible", false)
               |> Map.put("is_clickable", true)
      game_tiles = game_tiles
                   |> Map.put(index_1, tile_1)
                   |> Map.put(index_2, tile_2)
      game
      |> Map.put(:tiles, game_tiles)
      |> Map.put(:mismatch, nil)
    else
      game
    end
  end

  def is_first_guess?(prev_click_index) do
    prev_click_index === -1
  end

  def check_index(index) do
    if index < 0 || index > 15 do
      raise "Index out of bounds."
    end
  end

  # send a game to browser
  def client_view(game) do
    tiles = game[:tiles]
    %{
      tiles: get_tiles_value(tiles),
      #isVisible: get_tiles_visibility(tiles),
      numGuesses: game[:num_guesses],
      mismatch: game[:mismatch] === nil
    }
  end

  # return the index corresponding tile value if this tile visible,
  # otherwise return ""
  def get_tiles_value(tiles) do
    tiles
    |> Map.to_list()
    |> Enum.map(
         fn ({_, tile}) ->
           if tile["is_visible"] do
             tile["value"]
           else
             ""
           end
         end
       )

  end

  # return the visibility list of tiles
  #def get_tiles_visibility(tiles) do
    #tiles
    #|> Map.to_list()
    #|> Enum.map(
         #fn ({_, tile}) ->
           #tile["is_visible"]
         #end
       #)
  #end

end

