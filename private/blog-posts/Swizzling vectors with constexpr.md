# Swizzling Vectors with constexpr

Generally speaking, if you wanted to swizzle a vector in C++, you probably know which swizzle you want at compile time. With constexpr, this becomes pretty simple:

```cpp
#include <array>

struct Vector {
    int x, y, z;

	// Size will be inferred from the length of the string literal.
    template <size_t Size>
    constexpr std::array<int, Size-1> Swizzle(const char(&comps)[Size]) {
		// Since the size of comps includes the NUL-terminator at the end,
		// our result will be one shorter to only accomodate the relevant
		// components.
        std::array<int, Size-1> arr{};
        for (int i = 0; i < Size-1; i++) {
            switch (comps[i]) {
                case 'x':
                    arr[i] = x;
                    break;
                case 'y':
                    arr[i] = y;
                    break;
                case 'z':
                    arr[i] = z;
                    break;
            }
        }
        return arr;
    }
};
```

The template will handle a string literal of any length, returning an array of the requested components.

```cpp
int main() {
	Vector v{1, 2, 3};
	auto reverse = v.Swizzle("zyx");
	for (auto n : reverse)
		std::cout << n << '\n';
	std::cout.flush();
}
```
```shell
$ g++ swizzle.cpp -o swizzle
$ ./swizzle
3
2
1
```
