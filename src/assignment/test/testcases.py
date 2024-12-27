import pytest
from common_assignment.assignment import CommonAssignment
import sys
import matplotlib.pyplot as plt
import time

class TestCases:
    assignment = CommonAssignment()

    @pytest.mark.parametrize("n", [0, 1, 2, 10, 100, 1000000])
    def test_get_random(self, n):
        """Validate that the method generates numbers in the range [0, n] for various inputs."""
        result = self.assignment.get_random(n)
        assert 0 <= result <= n, f"Test failed for n={n}, result={result}"

    @pytest.mark.parametrize("n", [sys.maxsize])
    def test_get_random_large(self, n):
        """Check the behavior of the method for large input"""
        result = self.assignment.get_random(n)
        assert 0 <= result <= n, f"Test failed for n={n}, result={result}"

    @pytest.mark.parametrize("n", [-1])
    def test_get_random_large(self, n):
        """Check the behavior of the method for negative input"""
        with pytest.raises(AssertionError, match="Invalid Input"):
            self.assignment.get_random(n)

    @pytest.mark.parametrize("n", [100000])
    def test_randomness(self, n):
        """Verify that the generated values are evenly distributed across the range [0, n]"""
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

    @pytest.mark.parametrize("n", [10, 100, 1000, 10000, 100000])
    def test_get_random_performance(self, n):
        """Measure the performance of the method for increasing values of n"""
        assignment = CommonAssignment()
        start_time = time.perf_counter()
        for _ in range(1000):
            assignment.get_random(n)
        end_time = time.perf_counter()

        duration = end_time - start_time
        print(f"Performance test for n={n}: {duration:.4f} seconds")

        assert duration < 0.02, f"Performance test failed for n={n}, took too long: {duration:.4f} seconds"