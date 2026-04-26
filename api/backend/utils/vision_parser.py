import json
from pathlib import Path

class vision_parser:

    def __init__(self):
        self.OBJECT_NOISE = {
            "1d barcode", "barcode", "label", "text", "design",
            "bottled and jarred packaged goods", "graphics", "logo", 
            "watermark", "advertising", "font"
        }

        self.LABEL_NOISE = {
            "blue", "red", "green", "silver", "white", "black",
            "design", "still life photography", "pattern", "art",
            "technology", "telephony", "fluid", "liquid",
            "electronic device", "gadget", "communication device",
            "photography", "snapshot", "monochrome", "visual arts",
            "reflection", "lighting", "shadow", "glare", "indoor",
            "wall", "floor", "ceiling", "furniture", "table"
        }
    
        self.CONFIDENCE_THRESHOLD = 0.75

    def extract_item_from_response(self, vision_response: dict) -> str | None:

        for obj in vision_response.get("objects", []):
            if obj["score"] < self.CONFIDENCE_THRESHOLD:
                continue
            if obj["name"].lower() in self.OBJECT_NOISE:
                continue
            return obj["name"]

        for label in vision_response.get("labels", []):
            if label["score"] < self.CONFIDENCE_THRESHOLD:
                continue
            if label["description"].lower() in self.LABEL_NOISE:
                continue
            return label["description"]

        return None


    def extract_items_from_responses(self, vision_responses: list[dict]) -> list[str]:
        items = []
        for response in vision_responses:
            item = self.extract_item_from_response(response["vision"])
            if item:
                items.append(item)
            else:
                print(f"  Could not identify item in {response['image']['name']}")
        return items


    
# # Load test data
# test_file = Path(__file__).parent.parent.parent.parent / "resources" / "img3_2026-04-25T23-51-42-689Z.json"
# with open(test_file, "r") as f:
#     test_data = json.load(f)
# parser = vision_parser()
#                                          #C:\Users\adamo\Junk-Genie\resources
# # Test 1: extract_item_from_response
# print("Test 1: extract_item_from_response")
# item = parser.extract_item_from_response(test_data["vision"])
# print(f"  Input: vision response from {test_data['image']['name']}")
# print(f"  Output: {item}")
# print(f"  Expected: Mobile phone (or valid label if in OBJECT_NOISE)")
# assert item is not None, "Should extract an item"
# print("  ✓ Passed\n")

# # Test 2: extract_items_from_responses
# print("Test 2: extract_items_from_responses")
# items = parser.extract_items_from_responses([test_data])
# print(f"  Input: 1 vision response")
# print(f"  Output: {items}")
# assert len(items) == 1, "Should extract 1 item"
# assert items[0] is not None, "Item should not be None"
# print("  ✓ Passed\n")

# # Test 3: extract_items_from_responses with multiple responses
# print("Test 3: extract_items_from_responses (multiple)")
# items = parser.extract_items_from_responses([test_data, test_data, test_data])
# print(f"  Input: 3 vision responses")
# print(f"  Output: {items}")
# assert len(items) == 3, "Should extract 3 items"
# print("  ✓ Passed\n")

# print("All tests passed! ✓")