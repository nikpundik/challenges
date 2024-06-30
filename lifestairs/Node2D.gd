extends Node2D

@onready var _animated_sprite = $CharacterBody2D/AnimatedSprite2D
@onready var _stairs = $stairs
@onready var _background = $background
@onready var _splash_start = $splash_start
@onready var _splash_end = $splash_end
@onready var audio_player_1 = $AudioStreamPlayer2D
@onready var audio_player_2 = $AudioStreamPlayer2D2

const SPEED = 62
var stairs_scale = Vector2(1, 1)
var stairs_speed = Vector2(-SPEED, SPEED)
var initial_pos = Vector2(0, 0)

var state = 'HAPPY'
var target_blend_factor = 0.0
var current_blend_factor = 0.0
var blend_speed = 1.0
var bg_speed = 100.0
var target_bg_speed = bg_speed
var fps = 31.0
var target_fps = fps

func _ready():
	initial_pos = _stairs.position
	stairs_scale = _stairs.scale
	_splash_end.self_modulate.a = 0.0
	audio_player_1.play()
	audio_player_2.play()
	audio_player_2.volume_db = -80
	# _background.position.x = -3500

func _process(_delta):
	if Input.is_action_pressed("ui_right"):
		_animated_sprite.play("climb")
		var current_frame = _animated_sprite.frame
		var perc = current_frame / 31.0
		_background.position.x -= bg_speed * _delta
		if _background.position.x < -3475 && _background.position.x > -5174:
			state = 'DEPRESSED'
			target_blend_factor = 1.0
			target_bg_speed = 50.0
			target_fps = 6.0
		else:
			state = 'HAPPY'
			target_blend_factor = 0.0
			target_bg_speed = 100.0
			target_fps = 31.0
		
		fps = lerp(fps, target_fps, blend_speed * _delta)
		bg_speed = lerp(bg_speed, target_bg_speed, blend_speed * _delta)
		_animated_sprite.sprite_frames.set_animation_speed("climb", int(fps) )
		_stairs.position = initial_pos - Vector2(64.0 * perc, -60.0 * perc) * stairs_scale
	
		_splash_start.self_modulate.a = lerp(_splash_start.self_modulate.a, 0.0, 2.0 * _delta)
		if _background.position.x < -5900:
			_splash_end.self_modulate.a = lerp(_splash_end.self_modulate.a, 1.0, 2.0 * _delta)
		current_blend_factor = lerp(current_blend_factor, target_blend_factor, blend_speed * _delta)
		audio_player_1.volume_db = -80 * current_blend_factor;
		audio_player_2.volume_db = -80 * (1 - current_blend_factor);
	else:
		_animated_sprite.pause()

	var material = _animated_sprite.get_material()
	if material:
		material.set("shader_param/blend_factor", current_blend_factor)		
