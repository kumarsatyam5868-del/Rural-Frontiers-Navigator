import json

# This mimics the "Map Packager" mentioned in your PDF 
# It processes raw coordinates (simulating OSM data) into an optimized format [cite: 28]

def generate_offline_map_pack(region_name, start_coords, end_coords):
    # Simulated Routing Graph using the Contraction Hierarchies (CH) logic [cite: 31]
    map_pack = {
        "metadata": {
            "region": region_name,
            "accuracy_target": "<10m", # [cite: 36, 62]
            "engine": "GraphHopper-Sim" # [cite: 46, 75]
        },
        "rural_routing_graph": [
            {"id": "start", "lat": start_coords[0], "lon": start_coords[1], "type": "village_trail"},
            {"id": "mid", "lat": (start_coords[0]+end_coords[0])/2, "lon": (start_coords[1]+end_coords[1])/2, "type": "dirt_track"},
            {"id": "end", "lat": end_coords[0], "lon": end_coords[1], "type": "market"}
        ]
    }
    
    with open(f"{region_name.lower()}_pack.json", "w") as f:
        json.dump(map_pack, f, indent=4)
    print(f"✅ Offline Map Pack generated for {region_name} (Size: <50MB)") # [cite: 30, 44]

# Generate data for Jaipur/Kukas region [cite: 4]
generate_offline_map_pack("Jaipur_Rural", [27.0330, 75.8350], [26.9239, 75.8267])