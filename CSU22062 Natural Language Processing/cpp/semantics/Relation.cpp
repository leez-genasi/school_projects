#include "Relation.h"
#include <iostream>
#include <string>
#include <fstream>
#include "util.h"

using namespace std;

Rel::Rel() {
  arity = 0;
}

Rel::Rel(int n) {
  arity = n;
}

Rel::Rel(int n, string filename) {
  ifstream relstr;
  relstr.open(filename);
  if(!relstr) {
    cout << "prob opening the file\n";
    opened_ok = false;
  }
  else {
    opened_ok = true;
    arity = n;
    string line;
    while(getline(relstr,line)) {
      Tuple t;
      t = tokenize(line);
      if(t.size() != n) {
	cout << "line did not supply right number relation parts\n";
	opened_ok = false;
      }
      else {
	add_tuple(t);
      }
    }
  }

}

// check whether a given tuple is already there
bool Rel::has(Tuple t) {
  for(int i = 0; i < tuples.size(); i++) {
    if(tuples[i] == t) {
      return true;
    }
  }
  return false;
}

// add a fresh tuple to the relation; should only be used if the tuple
// is not already there
bool Rel::add_tuple(Tuple in) {
  if(in.size() != arity) {
    return false;
  }
  else {
    tuples.push_back(in);
    return true;
  }
}

// show all the tuples in the relation
void Rel::show() {

  for(Tuple t : tuples) {
    for(Thing o : t) {
       cout << o << " ";
     }
     cout << endl;
   }
  
}

// above are member method of Rel. Following are functions which are
// arguably easier thought of as functions which apply to Rel objects
// than member methods, thought that is really a matter of taste

// 'which' is a position in a tuple, 'val' is a looked for value at that pos
// if arity is n, any tuple t in r_in such that t[which]==val
// contributes a tuple to the output relation containing
// t[0] .. t[i-1] t[i+1] .. t[n-1]
// ie. a replica of t with t[which] 'erased'
Rel reduce(Rel r_in, int which, Thing val) {

  Rel r_out(r_in.arity-1);
  
  for(Tuple t : r_in.tuples) {
    if(t[which] == val) {
      Tuple t_out;
      t_out = erase(t,which);
      r_out.add_tuple(t_out);
    }
  }

  return r_out;
}

// helper function for above
// makes version of input tuple which has deleted position 'which'
// eg {a,b,c,d} and 2 gives {a,b,d}
// just wraps a pre-existing piece of vector functionality
Tuple erase(Tuple t, int which) {
  Tuple t_out = t;
  t_out.erase(t_out.begin()+which);
  return t_out;
}

// checks if tuple <o> is the tuples of pred
// applies only to arity 1 relations
// essentially checking whether o is in the set represented by pred
bool true_of(Rel pred, Thing o) {
  if(pred.arity != 1) {
    return false;
  }

  bool found_it = false;
  for(Tuple t : pred.tuples) {
    if(t[0] == o) {
      found_it = true;
      break;
    }
  }

  return found_it;
}

// checks various relationships between p and q depending on gq
// gq will in the end be a determiner word
bool gen_quant(string gq, Rel p, Rel q) {

  if(gq == "a") {
    return some(p,q);
  }
  else if (gq == "every") {
    return every(p,q);
  }
  else {
    // possible other cases where
    return false;
  }

}

// essentially checks whether the set represented by p had a non-empty intersection with
// the set represented by q 
bool some(Rel p, Rel q) {
  bool check = false;

  for(Tuple t : p.tuples) {

    if(q.has(t) == true) {
      check = true;
      break;
    }
  }
  return check;
}

// essentially checks whether the set represented by p is a subset of
// the set represented by q 
bool every(Rel p, Rel q) {
  bool check = true;

  for(Tuple t : p.tuples) {

    if(q.has(t) == false) {
      check = false;
      break;
    }
  }
  return check;
}

// essentially calculated the intersection of the sets represented by p and q
Rel meet(Rel p, Rel q) {
  Rel out(p.arity);
  for(Tuple t : p.tuples) {

    if(q.has(t)) {
      out.add_tuple(t);
      }
  }
  return out;

}

