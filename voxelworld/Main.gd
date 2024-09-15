extends Node3D

@export var world_scene: PackedScene

enum WorldState { IDLE, GENERATING_DISPLAY, GENERATING, PLAYING, DEAD }

var world_state: WorldState = WorldState.IDLE
var world_instance: VoxelWorld
var games: int = 0

func _ready():
	enter_idle_state()

func _input(event):
	if world_state == WorldState.IDLE or world_state == WorldState.DEAD:
		if event.is_action_pressed("hit"):
			enter_generating_display_state()

func enter_idle_state():
	world_state = WorldState.IDLE
	$UI/CenterContainer/Label.text = "left click to start"
	
func enter_generating_display_state():
	world_state = WorldState.GENERATING_DISPLAY
	$UI/CenterContainer/Label.text = "generating world\nplease wait"
	await get_tree().create_timer(1.0).timeout
	enter_generating_state()

func enter_generating_state():
	world_state = WorldState.GENERATING
	world_instance = world_scene.instantiate()
	add_child(world_instance)
	world_instance.player_dead.connect(player_dead)
	enter_playing_state()
	
func enter_playing_state():
	world_state = WorldState.PLAYING
	$UI.visible = false

func player_dead():
	world_instance.queue_free()
	Engine.time_scale = 1
	world_state = WorldState.DEAD
	$UI.visible = true
	$UI/CenterContainer/Label.text = "GHOSTED TOO MUCH\nleft click to start"
