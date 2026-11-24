#include <stdio.h>

int main() {
    int n, a, b, c, sum;

    printf("Enter a 3-digit number: ");
    scanf("%d", &n);

    n = (n < 0) ? -n : n;

    a = n / 100;
    b = (n / 10) % 10;
    c = n % 10;

    sum = a + b + c;

    printf("Sum of digits = %d", sum);

    return 0;
}