class_name GameUI
extends Control

@onready var season_label: Label = $MarginContainer/VBoxContainer/Top/Season
@onready var counter_label: Label = $MarginContainer/VBoxContainer/Top/Counter
@onready var ghosted_label: Label = $MarginContainer/VBoxContainer/Ghosted
@onready var lifes_label: Label = $MarginContainer/VBoxContainer/Bottom/Lifes

func set_season(season: VoxelWorld.Season, counter: int):
	counter_label.text = "%s" % counter
	match season:
		VoxelWorld.Season.SUMMER:
			season_label.text = 'summer'
		VoxelWorld.Season.AUTUMN:
			season_label.text = 'autumn'
		VoxelWorld.Season.WINTER:
			season_label.text = 'winter'
		VoxelWorld.Season.SPRING:
			season_label.text = 'spring'
			
func set_ghosted(visible: bool):
	ghosted_label.set_visibility_layer_bit(1, visible)

func set_lifes(lifes: int):
	lifes_label.text = "%s" % lifes
