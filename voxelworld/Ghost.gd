class_name Ghost
extends CharacterBody3D

@export var player: CharacterBody3D 
@export var base_speed: float = 1.0

@export var collision_radius: float = 1.5
var max_height: float = 10.0

signal player_caught

func _physics_process(delta):
	if not player:
		return
		
	var direction_to_player = (player.global_transform.origin - global_transform.origin)
	if direction_to_player.length() > collision_radius:
		direction_to_player = direction_to_player.normalized()
		var current_speed = base_speed + (max_height - min(global_transform.origin.y, max_height))
		velocity = direction_to_player * current_speed
		move_and_slide()

	if global_transform.origin.distance_to(player.global_transform.origin) < collision_radius:
		on_player_collision()

func on_player_collision():
	player.caught()
	player_caught.emit()
