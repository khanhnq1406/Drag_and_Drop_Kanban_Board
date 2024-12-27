import random

class CommonAssignment:
    def __init__(self):
        pass
    
    def get_1_or_0(self) -> int:
        return random.choice([0, 1])
    
    def get_random(self, n) -> int:
        if n == 0:
            return 0
        while True:
            result = 0
            for i in range(n.bit_length()):
                result |= self.get_1_or_0() << i
            if result < n:
                return result