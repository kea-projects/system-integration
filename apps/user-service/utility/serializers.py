import json
import uuid


class UUIDEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, uuid.UUID):
            # if the obj is uuid, we simply return the value of uuid
            return o.hex
        # otherwise, encode as normal
        return json.JSONEncoder.default(self, o)
