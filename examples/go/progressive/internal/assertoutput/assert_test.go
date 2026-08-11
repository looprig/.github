package assertoutput

import (
	"errors"
	"testing"
)

func TestMustEqualAcceptsEqualValues(t *testing.T) {
	MustEqual("answer", "hello", "hello")
	MustEqual("count", 2, 2)
}

func TestMustEqualPanicsWithNamedDifference(t *testing.T) {
	defer func() {
		got := recover()
		if got == nil {
			t.Fatal("MustEqual() did not panic")
		}
		if got != `answer: got "hello", want "goodbye"` {
			t.Fatalf("panic = %q", got)
		}
	}()
	MustEqual("answer", "hello", "goodbye")
}

func TestMustContainAndMustSucceed(t *testing.T) {
	MustContain("answer", "hello world", "world")
	MustSucceed(nil)
	assertPanics(t, func() { MustContain("answer", "hello", "world") })
	assertPanics(t, func() { MustSucceed(errors.New("boom")) })
}

func assertPanics(t *testing.T, fn func()) {
	t.Helper()
	defer func() {
		if recover() == nil {
			t.Fatal("function did not panic")
		}
	}()
	fn()
}
