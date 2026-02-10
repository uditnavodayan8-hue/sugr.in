import math

# Recursive function to calculate factorial
def factorial(n):
    if n == 0 or n == 1: # Base condition
        return 1
    else:
        return n * factorial(n-1) # Recursive call

# Recursive function to calculate sin(x) using series
def sin_series(x, n):
    if n == 0: # Base condition (first term)
        return x
    else:
        # Calculate the nth term in the series logic
        # Term n (0-indexed) corresponds to (-1)^n * x^(2n+1) / (2n+1)!
        term = ((-1)**n) * (x**(2*n+1)) / factorial(2*n+1)
        return term + sin_series(x, n-1) # Recursive call

if __name__ == "__main__":
    try:
        # Input (in radians)
        x_str = input("Enter value of x (in radians): ")
        x = float(x_str)
        n_str = input("Enter number of terms: ")
        n = int(n_str)
        
        if n <= 0:
            print("Number of terms must be positive.")
        else:
            # We subtract 1 because our series function uses 0-based indexing for terms
            result = sin_series(x, n-1)
            print(f"sin(x) using recursive series: {result}")
            print(f"sin(x) using math library: {math.sin(x)}")
            
    except ValueError:
        print("Invalid input. Please enter numeric values.")
