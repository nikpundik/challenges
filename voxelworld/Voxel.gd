class_name Voxel

enum VoxelType { GRASS, DIRT, SAND, WATER }

var position: Vector3
var type: VoxelType
var instance: StaticBody3D
var key: String
var hit_points: int = 100

func _init(_position: Vector3, _type: VoxelType):
	position = _position
	type = _type
	key = key_from_xyz(position.x, position.y, position.z)
	
func is_hidden():
	return not instance
	
func is_broken():
	return hit_points <= 0

func hit(power: int):
	hit_points -= power

static func key_from_xyz(x, y, z) -> String:
	return "{0}_{1}_{2}".format([x, y, z])
