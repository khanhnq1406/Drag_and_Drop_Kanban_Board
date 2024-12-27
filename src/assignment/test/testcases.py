import pytest
from common_assignment.assignment import CommonAssignment
import sys
import matplotlib.pyplot as plt
import random
class TestCases:
    assignment = CommonAssignment()

    @pytest.mark.parametrize("n", [0, 1, 2, 10, 100, 1000000])
    def test_get_random(self, n):
        """This is test"""
        result = self.assignment.get_random(n)
        assert 0 <= result <= n, f"Test failed for n={n}, result={result}"

    @pytest.mark.parametrize("n", [sys.maxsize])
    def test_get_random_large(self, n):
        result = self.assignment.get_random(n)
        assert 0 <= result <= n, f"Test failed for n={n}, result={result}"

    @pytest.mark.parametrize("n", [100000])
    def test_randomness(self, n):
        result = []
        for i in range(n):
            result.append(self.assignment.get_random(n))
        plt.figure(figsize=(10, 6))
        plt.hist(result, bins=50, color='green', alpha=0.7, edgecolor='black')
        plt.title("Distribution of Random Values")
        plt.xlabel("Value")
        plt.ylabel("Frequency")
        plt.grid(alpha=0.5)
        plt.show()
        plt.savefig("distribution_chart.png")
        assert True
