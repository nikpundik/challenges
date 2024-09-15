class_name VoxelWorld
extends Node3D

enum Season { SUMMER, AUTUMN, WINTER, SPRING }

@export var voxel_scene: PackedScene
@export var ghost_scene: PackedScene
@export var world_size: Vector2i = Vector2i(100, 100)
@export var max_height: int = 20
@export var noise_frequency: float = 0.05

@export var water_level: float = 0.45
@export var sand_level: float = 0.5
@export var terrain_level: float = 0.55
@export var grass_level: float = 1.0

@onready var player: Player = $Player
@onready var game_ui: GameUI = $GameUI
@onready var hit_particles: GPUParticles3D = $HitParticles
@onready var place_voxel_instance: MeshInstance3D = $PlaceVoxel

signal player_dead

var noise := FastNoiseLite.new()
var random = RandomNumberGenerator.new()

var water_material = StandardMaterial3D.new()
var sand_material = StandardMaterial3D.new()
var terrain_material = StandardMaterial3D.new()
var grass_material = StandardMaterial3D.new()

var season_timer: Timer = Timer.new()
var ghosted_timer: Timer = Timer.new()

var world_map_dict: Dictionary = {}
var season_index: int = 0
var seasons: Array = [Season.SUMMER, Season.AUTUMN, Season.WINTER, Season.SPRING]
const SEASON_DURATION: float = 20.0
var ghosts: Array = []
const GHOSTING_SCALE: float = 0.05
const GHOSTING_DURATION: float = 1.0 * 0.05

func _ready():
	start()

func start():
	var time_start = Time.get_unix_time_from_system()
	setup_materials()
	setup_noise()
	generate_world()
	add_invisible_walls()
	create_world()
	setup_signals()
	setup_timers()
	update_season()
	update_lifes()
	var time_end = Time.get_unix_time_from_system()
	var time_elapsed = time_end - time_start
	print(time_elapsed)

func setup_timers():
	add_child(season_timer)
	season_timer.timeout.connect(next_season)
	season_timer.start(SEASON_DURATION)
	add_child(ghosted_timer)
	ghosted_timer.one_shot = true
	ghosted_timer.timeout.connect(end_ghosting)

func end_ghosting():
	game_ui.set_ghosted(false)
	Engine.time_scale = 1

func update_lifes():
	game_ui.set_lifes(player.lifes)

func update_season():
	setup_materials()
	var season = get_season()
	game_ui.set_season(season, season_index + 1)
	if season == Season.WINTER:
		for i in season_index:
			create_ghost()
	else:
		clear_ghosts()

func clear_ghosts():
	if ghosts.size() > 0:
		for ghost in ghosts:
			ghost.queue_free()
		ghosts.clear()

func next_season():
	season_index += 1
	update_season()

func setup_signals():
	player.voxel_hit.connect(on_voxel_hit)
	player.voxel_place.connect(on_voxel_place)

func on_voxel_hit(voxel: Voxel, power: int):
	voxel.hit(power)
	if voxel.is_broken():
		remove_voxel(voxel)
	else:
		play_hit_particles_at_voxel(voxel)
	
func on_voxel_place(voxel: Voxel):
	var placed = place_voxel(voxel)
	if placed:
		play_hit_particles_at_voxel(voxel)

func play_hit_particles_at_voxel(voxel: Voxel):
	if voxel.instance:
		hit_particles.position = voxel.instance.position
		hit_particles.position.y += 0.5
		hit_particles.restart()

func get_season():
	return seasons[fmod(season_index, seasons.size())]

func setup_materials():
	var season = get_season()
	match season:
		Season.WINTER:
			water_material.albedo_color = Color(0.5, 0.8, 1.0)
			sand_material.albedo_color = Color(1.0, 1.0, 0.9)
			terrain_material.albedo_color = Color(0.9, 0.85, 0.7)
			grass_material.albedo_color = Color(0.7, 1.0, 0.7)
		_:
			water_material.albedo_color = Color(0.0, 0.4, 0.8)
			sand_material.albedo_color = Color(1.0, 0.9, 0.6)
			terrain_material.albedo_color = Color(0.5, 0.35, 0.2)
			grass_material.albedo_color = Color(0.3, 0.8, 0.2)

func setup_noise():
	noise.noise_type = FastNoiseLite.TYPE_PERLIN
	noise.frequency = noise_frequency

func get_material(voxel_type: Voxel.VoxelType):
	match voxel_type:
		Voxel.VoxelType.WATER:
			return water_material
		Voxel.VoxelType.SAND:
			return sand_material
		Voxel.VoxelType.DIRT:
			return terrain_material
		Voxel.VoxelType.GRASS:
			return grass_material
	return water_material
	
func get_voxel_type(height_value: float):
	if height_value <= water_level:
		return Voxel.VoxelType.WATER
	elif height_value <= sand_level:
		return Voxel.VoxelType.SAND
	elif height_value <= terrain_level:
		return Voxel.VoxelType.DIRT
	elif height_value <= grass_level:
		return Voxel.VoxelType.GRASS
	return Voxel.VoxelType.GRASS

func get_voxel_at(x: int, y: int, z: int) -> Voxel:
	var key = Voxel.key_from_xyz(x, y, z)
	if not world_map_dict.has(key):
		return null
	return world_map_dict[key]

func is_voxel_hidden(voxel: Voxel):
	for diff in direct_neighbours_dx:
		var x = voxel.position.x + diff.x
		var y = voxel.position.y + diff.y
		var z = voxel.position.z + diff.z
		var neighbour = get_voxel_at(x, y, z)
		if y > 0 and not neighbour:
			return false
	return true

func create_voxel(voxel: Voxel):
	var voxel_instance = voxel_scene.instantiate()
	voxel_instance.transform.origin = voxel.position
	var material = get_material(voxel.type)
	voxel_instance.get_node("MeshInstance3D").set_surface_override_material(0, material)
	voxel.instance = voxel_instance
	voxel_instance.voxel = voxel
	add_child(voxel_instance)

func create_world():
	var count = 0
	for key in world_map_dict:
		var voxel = world_map_dict[key]
		if not is_voxel_hidden(voxel):
			count += 1
			create_voxel(voxel)
	print("visible ", count)

func create_ghost():
	var ghost_instance = ghost_scene.instantiate()
	ghost_instance.player = player
	var ghost_position = Vector3.ZERO
	ghost_position.y = max_height
	if random.randf() > 0.5:
		ghost_position.z = random.randf_range(0.0, world_size.y)
	else:
		ghost_position.x = random.randf_range(0.0, world_size.x)
	ghost_instance.position = ghost_position
	ghost_instance.player_caught.connect(player_caught)
	add_child(ghost_instance)
	ghosts.append(ghost_instance)

func player_caught():
	update_lifes()
	clear_ghosts()
	if player.is_dead():
		player_dead.emit()
	else:
		Engine.time_scale = GHOSTING_SCALE
		ghosted_timer.start(GHOSTING_DURATION)
		game_ui.set_ghosted(true)

func hide_voxel(voxel: Voxel):
	if voxel.instance:
		voxel.instance.queue_free()
		voxel.instance = null

func destroy_voxel(voxel: Voxel):
	hide_voxel(voxel)
	world_map_dict[voxel.key] = null

func remove_voxel(voxel: Voxel):
	if voxel.position.y > 0:
		destroy_voxel(voxel)
		for diff in direct_neighbours_dx:
			var x = voxel.position.x + diff.x
			var y = voxel.position.y + diff.y
			var z = voxel.position.z + diff.z
			var neighbour = get_voxel_at(x, y, z)
			if neighbour and neighbour.is_hidden() and not is_voxel_hidden(neighbour):
				create_voxel(neighbour)

func move_place_voxel(voxel: Voxel):
	var x = voxel.position.x
	var y = voxel.position.y
	var z = voxel.position.z
	var dir = voxel.position.direction_to(player.position)
	if (abs(dir.x) > abs(dir.y) and abs(dir.x) > abs(dir.z)):
		x += 1 * sign(dir.x)
	if (abs(dir.y) > abs(dir.x) and abs(dir.y) > abs(dir.z)):
		y += 1 * sign(dir.y)
	if (abs(dir.z) > abs(dir.x) and abs(dir.z) > abs(dir.y)):
		z += 1 * sign(dir.z)
	var dest = get_voxel_at(x, y, z)
	if not dest:
		place_voxel_instance.visible = true
		place_voxel_instance.position = Vector3(x, y, z)
	else:
		place_voxel_instance.visible = true

func place_voxel(voxel: Voxel):
	var x = voxel.position.x
	var y = voxel.position.y
	var z = voxel.position.z
	var dir = voxel.position.direction_to(player.position)
	if (abs(dir.x) > abs(dir.y) and abs(dir.x) > abs(dir.z)):
		x += 1 * sign(dir.x)
	if (abs(dir.y) > abs(dir.x) and abs(dir.y) > abs(dir.z)):
		y += 1 * sign(dir.y)
	if (abs(dir.z) > abs(dir.x) and abs(dir.z) > abs(dir.y)):
		z += 1 * sign(dir.z)
	var dest = get_voxel_at(x, y, z)
	if not dest:
		var voxel_position = Vector3(x, y, z)
		var voxel_type = Voxel.VoxelType.GRASS
		var new_voxel = Voxel.new(voxel_position, voxel_type)
		world_map_dict[new_voxel.key] = new_voxel
		create_voxel(new_voxel)
		return true
	return false

var direct_neighbours_dx: Array = [
	Vector3i(0, 1, 0),
	Vector3i(0, -1, 0),
	Vector3i(1, 0, 0),
	Vector3i(-1, 0, 0),
	Vector3i(0, 0, 1),
	Vector3i(0, 0, -1),
]

func generate_world():
	world_map_dict = {}
	var highest: Vector3 = Vector3.ZERO
	for x in range(world_size.x):
		for z in range(world_size.y):
			var height_value = (noise.get_noise_2d(x, z) + 1.0) / 2.0
			var height = int(height_value * max_height)
			for y in range(height):
				var voxel_position = Vector3(x, y, z)
				var voxel_type = get_voxel_type(height_value)
				var voxel = Voxel.new(voxel_position, voxel_type)
				if voxel_position.y > highest.y:
					highest = voxel_position
				world_map_dict[voxel.key] = voxel
	player.position = highest
	player.position.y += 3
	
func _physics_process(delta):
	if player.place_mode and player.target_voxel:
		move_place_voxel(player.target_voxel)
	else:
		place_voxel_instance.visible = false

func add_invisible_walls():
	# Create an invisible wall at x = 0
	var wall_left = StaticBody3D.new()
	var collision_shape_left = CollisionShape3D.new()
	var box_shape_left = BoxShape3D.new()
	box_shape_left.extents = Vector3(0.5, 1000, world_size.y / 2)
	collision_shape_left.shape = box_shape_left
	wall_left.add_child(collision_shape_left)
	wall_left.transform.origin = Vector3(-0.5, 0, world_size.y / 2)
	add_child(wall_left)

	# Create an invisible wall at x = world_size.x
	var wall_right = StaticBody3D.new()
	var collision_shape_right = CollisionShape3D.new()
	var box_shape_right = BoxShape3D.new()
	box_shape_right.extents = Vector3(0.5, 1000, world_size.y / 2)
	collision_shape_right.shape = box_shape_right
	wall_right.add_child(collision_shape_right)
	wall_right.transform.origin = Vector3(world_size.x - 0.5, 0, world_size.y / 2)
	add_child(wall_right)

	# Create an invisible wall at z = 0
	var wall_front = StaticBody3D.new()
	var collision_shape_front = CollisionShape3D.new()
	var box_shape_front = BoxShape3D.new()
	box_shape_front.extents = Vector3(world_size.x / 2, 1000, 0.5)
	collision_shape_front.shape = box_shape_front
	wall_front.add_child(collision_shape_front)
	wall_front.transform.origin = Vector3(world_size.x / 2, 0, -0.5)
	add_child(wall_front)

	# Create an invisible wall at z = world_size.y
	var wall_back = StaticBody3D.new()
	var collision_shape_back = CollisionShape3D.new()
	var box_shape_back = BoxShape3D.new()
	box_shape_back.extents = Vector3(world_size.x / 2, 1000, 0.5)
	collision_shape_back.shape = box_shape_back
	wall_back.add_child(collision_shape_back)
	wall_back.transform.origin = Vector3(world_size.x / 2, 0, world_size.y - 0.5)
	add_child(wall_back)
