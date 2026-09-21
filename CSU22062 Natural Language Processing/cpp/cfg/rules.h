#if !defined RULES
#define RULES


#include <string>
#include <vector>

using namespace std;

/*! \file
 * the context free grammar classes
 */



//! represents a category in a syntax rule
class Category {
 public:
  string cat; //!< the name of the category
  bool terminal;  //!< indicates whether a terminal category
  Category(string c); //!< constructs from a string
  Category(); //!< void constructor does nothing
  ~Category(); //!< destructor does nothing present only for debugging reasons
  void print(); //!< prints the category
  bool operator==(const Category&);
};

//! represents a syntax rule
class Rule {
 public:
  Category mother; //!< the mother of the rule
  vector<Category> dtrs; //!< the daughters of the rule
  Rule(string r); //!< constructs from a string
  Rule(); //!< void constructor does nothing
  ~Rule(); //!< destructor does nothing present only for debugging reasons
  void print(); //!< prints the rule
};

//! represents a grammar
class Grammar {
 public:
  vector<Rule> rules; //!< the rules of the grammar
  unsigned int nrules; //!< the number of rules
  Category initial; //!< the initial category or 'start symbol' of the grammar
  Grammar(string file); //!< constructs given name of a file containing rules
  Grammar(); //!< void constructor does nothing
  ~Grammar(); //!< destructor does nothing present only for debugging reasons
  void print(); //!< prints the grammar
};

//! checks equality of categories
bool are_equal(Category c1, Category c2);


// need this as a way to give the ordering function to maps on 
// Categories
// I dont really get the syntax its just taken down from the STL
// documentation from an example for map
struct Cat_lt
{
  bool operator()(Category c1, Category c2) 
  {
    if(!c1.terminal && c2.terminal) {
      return true;
    }
    else if (c1.terminal && !(c2.terminal)) {
      return false;
    }
    else {
      return (c1.cat < c2.cat);
    }
  }
};

#endif
