int power(int base, int n) {
    int p=1;
    for (int i=1; i<=n; i++){
        p = p*base;
    }
    return p;
};