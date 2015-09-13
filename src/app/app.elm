module App where

import Html exposing (..)
import Html.Attributes exposing (..)
import String exposing( toUpper,repeat ,trimRight,reverse)

title message times=
  message ++ " "
     |> toUpper
     |> trimRight
     |> text

main =
   div
     [ class "header"]
     [
       h1 [] [title "Elm Starter Kit!" 1]
     ]
