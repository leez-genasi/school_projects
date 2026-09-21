#include <iostream>
#include "Person.h"

using namespace std;

int main() {
    Person greg;
    greg.age_set(21);
    greg.height = 2.2;

    cout << "Greg's age is " << greg.get_age() << endl;
    cout << "Greg's height is " << greg.height << "m.\n";
    greg.age_up(2);
    cout << "Two years later...\nGreg is " << greg.get_age() << " years old.\n";

    Person john;
    Person *prt;
    prt = &john;
    john.age_set(4);
    prt->height = 2.2; // pointer shorthand, only works if public
    cout << "John is " << john.get_age() << " years old and " << prt->height << "m tall.\n";

    Person harry(10, 1.2);
    cout << "Harry is " << harry.get_age() << " years old and " << harry.height << "m tall.\n";
}