extends CharacterBody3D
class_name Player

@export var speed = 14
@export var rotation_speed = 3
@export var fall_acceleration = 75
@export var jump_impulse = 20
@export var sensitivity = 0.01
@export var vertical_sensitivity = 0.01
@export var max_look_up = 90
@export var max_look_down = -90

var lifes: int = 3

signal voxel_hit(voxel: Voxel, power: int)
signal voxel_place(voxel: Voxel)

var target_velocity = Vector3.ZERO
var pitch = 0
var hit_power = 40

var target_voxel: Voxel = null
var place_mode: bool = false

@onready var camera = $Pivot/Camera3D
@onready var raycast = $Pivot/Camera3D/RayCast3D

func _ready():
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	
func _unhandled_input(event):
	if event is InputEventMouseMotion:
		rotate_y(-event.relative.x * sensitivity)
		
		pitch -= event.relative.y * vertical_sensitivity
		pitch = clamp(pitch, deg_to_rad(max_look_down), deg_to_rad(max_look_up))
		camera.rotation.x = pitch

func _input(event):
	if event.is_action_pressed("ui_cancel"):
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)

func _physics_process(delta):
	if Input.is_action_just_pressed("build_mode"):
		place_mode = not place_mode
	update_target_voxel()
	handle_interaction()
	
	var direction = Vector3.ZERO

	if Input.is_action_pressed("move_right"):
		direction += transform.basis.x
	if Input.is_action_pressed("move_left"):
		direction -= transform.basis.x
	if Input.is_action_pressed("move_forward"):
		direction -= transform.basis.z
	if Input.is_action_pressed("move_back"):
		direction += transform.basis.z

	if direction != Vector3.ZERO:
		direction = direction.normalized()

	target_velocity.x = direction.x * speed
	target_velocity.z = direction.z * speed

	if not is_on_floor():
		target_velocity.y = velocity.y - (fall_acceleration * delta)
	else:
		target_velocity.y = 0
	
	if is_on_floor() and Input.is_action_just_pressed("jump"):
		target_velocity.y = jump_impulse

	velocity = target_velocity
	move_and_slide()

func update_target_voxel():
	if raycast.is_colliding():
		var collided_object = raycast.get_collider()
		if collided_object and collided_object.voxel:
			target_voxel = collided_object.voxel
			return
	target_voxel = null

func handle_interaction():
	if target_voxel:
		if Input.is_action_just_pressed("place"):
			voxel_place.emit(target_voxel)
		if Input.is_action_just_pressed("hit"):
			voxel_hit.emit(target_voxel, hit_power)

func caught():
	lifes -= 1
	
func is_dead():
	return lifes <= 0
