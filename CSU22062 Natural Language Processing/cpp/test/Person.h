class Person {
    public:
    Person();
    Person(int, float);
    float height;
    void grow();
    void age_up(int);
    void age_set(int);
    int get_age();

    private:
    int age;
};