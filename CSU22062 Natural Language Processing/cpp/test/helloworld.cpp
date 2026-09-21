#include <iostream>
#include <string>
#include <fstream>
#include "power_func.h"

using namespace std;

int main() {
    cout << "hello, world\n";
    cout << "and how are you?\n";

    int fahr, celsius;
    int lower, upper, step;

    lower = 0;
    upper = 300;
    step = 20;

    fahr = lower;
    while (fahr <= upper) {
        celsius = 5 * (fahr-32)/9;
        cout << fahr << '\t' << celsius << '\n';
        fahr = fahr + step;
    }

    int i, j;
    cout << "enter two whole numbers, separated by space:\n";
    cin >> i >> j;
    cout << "the sum is " << i+j << "\n";

    string word;
    ifstream myinput;
    int k = 0;

    myinput.open("file_of_text.txt");
    while (myinput >> word){
        k++;
    }
    cout << k << '\n';

    ofstream out("output.txt");
    out << i+j << "\nhello world\n";
    out.close();

    cout << "Power of 3\n";
    for (int base=0; base<10; base++){
        cout << power(base, 3) << "\n";
    }
}