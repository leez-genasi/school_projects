#include "Person.h"

using namespace std;

Person::Person() {}
Person::Person(int age_in, float height_in){
    age = age_in;
    height = height_in;
}

void Person::grow() {
    height+=0.5;
}

void Person::age_set(int year){
    age = year;
}

int Person::get_age(){
    return age;
}

void Person::age_up(int years){
    age = age + years;
}