#!/usr/bin/env python3
"""Re-runnable numeric checks for JELET-2017 Mathematics (Q1-Q20).

Pure standard library, no network, no writes. Each check is independent of the
reasoning in the key file: it recomputes the quantity from the printed data and
prints the value the key claims, so a reviewer can re-run it in one command.

    python3 editorial/derived-keys/2017/checks/math-q01-20.py        # all
    python3 editorial/derived-keys/2017/checks/math-q01-20.py -q 6   # one

Exit code 0 when every check agrees with the key's expected value, 1 otherwise.
Items with no numeric formulation (definitions, proofs, operation counts stated
as formulae) are listed by --list as NOT-COMPUTABLE; they carry no machine check
in the key file rather than a fake one.

Scope note: these checks validate the *algebra*, not the transcription. They
cannot tell whether the corpus options are the booklet's options.
"""
import argparse
import math
import random
from fractions import Fraction

# --- individual checks: each returns (expected, observed, agree) -------------


def q1_skew_even_order_perfect_square():
    """det of an even-order skew-symmetric matrix is a perfect square (Pfaffian^2).

    Exact integer arithmetic: the matrices have integer entries, so the
    determinant is an exact integer, and the test is whether it equals k*k for
    an integer k. A float sqrt test would be vacuous and is deliberately avoided.
    """
    random.seed(2017)
    tested = 0
    for n in (2, 4):
        for _ in range(50):
            A = [[Fraction(0)] * n for _ in range(n)]
            for i in range(n):
                for j in range(i + 1, n):
                    v = Fraction(random.randint(-9, 9))
                    A[i][j] = v
                    A[j][i] = -v
            det = determinant(A)  # exact Fraction
            if det < 0:
                return ("det >= 0", f"det = {det}", False)
            k = math.isqrt(int(det))
            if Fraction(k * k) != det:
                return ("det = k*k for an integer k", f"det = {det} is not a perfect square", False)
            tested += 1
    return ("det = k*k for an integer k, for every even-order skew-symmetric matrix",
            f"holds for all {tested} sampled matrices, exact integer arithmetic", True)


def q3_unit_vectors_sum_zero():
    """|a|=|b|=|c|=1, a+b+c=0  =>  a.b + b.c + c.a = -3/2."""
    a = (1.0, 0.0)
    t = 2 * math.pi / 3
    b = (math.cos(t), math.sin(t))
    c = (-a[0] - b[0], -a[1] - b[1])
    s = dot(a, b) + dot(b, c) + dot(c, a)
    return ("-1.5", f"{s:.12f}", abs(s + 1.5) < 1e-12)


def q5_difference_quotient():
    """Delta(f/g) = (g*Df - f*Dg) / (g*(g+Dg))."""
    f, g, df, dg = 3.0, 5.0, 0.7, -0.2
    lhs = (f + df) / (g + dg) - f / g
    rhs = (g * df - f * dg) / (g * (g + dg))
    return (f"{rhs:.12f}", f"{lhs:.12f}", abs(lhs - rhs) < 1e-12)


def q6_simpson_two_subintervals():
    """Integral 1..2 dx/x by Simpson 1/3 with h = 0.5."""
    h = 0.5
    f = lambda x: 1.0 / x
    s = h / 3 * (f(1.0) + 4 * f(1.5) + f(2.0))
    return ("0.694", f"{s:.6f}", abs(s - 0.694) < 0.001)


def q7_newton_raphson_root():
    """Newton-Raphson on x^3 - 8x - 4 from x0 = 3."""
    x = 3.0
    for _ in range(30):
        x = x - (x ** 3 - 8 * x - 4) / (3 * x ** 2 - 8)
    return ("3.05", f"{x:.6f}", abs(x - 3.05) < 0.01)


def q8_trapezoidal_five_ordinates():
    """Integral 0..1 dx/(1+x) by the trapezoidal rule with five ordinates."""
    h = 0.25
    xs = [0 + i * h for i in range(5)]
    f = lambda x: 1.0 / (1.0 + x)
    t = h / 2 * (f(xs[0]) + f(xs[-1]) + 2 * sum(f(x) for x in xs[1:-1]))
    # the printed options are 0.793/0.693/0.593/0.513; the nearest is 0.693
    nearest = min([0.793, 0.693, 0.593, 0.513], key=lambda v: abs(v - t))
    return ("0.693 (nearest printed option)", f"trapezoid = {t:.6f}, nearest option = {nearest}", nearest == 0.693)


def q11_exact_differential():
    """(cos y + y cos x)dx + (sin x - x sin y)dy = 0 is exact with potential x cos y + y sin x."""
    M = lambda x, y: math.cos(y) + y * math.cos(x)
    N = lambda x, y: math.sin(x) - x * math.sin(y)
    p = lambda x, y: x * math.cos(y) + y * math.sin(x)
    h = 1e-6
    ok = True
    for x, y in [(0.3, 0.7), (1.1, -0.4), (-0.8, 2.0)]:
        dMy = (M(x, y + h) - M(x, y - h)) / (2 * h)
        dNx = (N(x + h, y) - N(x - h, y)) / (2 * h)
        px = (p(x + h, y) - p(x - h, y)) / (2 * h)
        py = (p(x, y + h) - p(x, y - h)) / (2 * h)
        ok = ok and abs(dMy - dNx) < 1e-5 and abs(px - M(x, y)) < 1e-5 and abs(py - N(x, y)) < 1e-5
    return ("dM/dy = dN/dx and dP/dx = M, dP/dy = N for P = x cos y + y sin x", "holds at 3 sampled points", ok)


def q13_particular_integral():
    """y = x/2 + 3/4 satisfies y'' + 4y = 2x + 3."""
    y = lambda x: x / 2 + 3 / 4
    h = 1e-4
    ok = True
    for x in (0.0, 1.0, -2.5):
        y2 = (y(x + h) - 2 * y(x) + y(x - h)) / h ** 2
        ok = ok and abs(y2 + 4 * y(x) - (2 * x + 3)) < 1e-4
    return ("y'' + 4y = 2x + 3 for y = x/2 + 3/4", "residual < 1e-4 at 3 points", ok)


def q16_two_heads_in_four():
    """P(exactly 2 heads in 4 fair tosses) = C(4,2)/2^4."""
    from math import comb
    p = comb(4, 2) / 2 ** 4
    return ("0.375 = 3/8", f"{p:.6f} = {Fraction(comb(4, 2), 16)}", abs(p - 0.375) < 1e-12)


def q19_conditional_probability():
    """P(A)=0.3, P(B)=0.5, P(AuB)=0.7 => P(A|B)=0.2."""
    pa, pb, pu = 0.3, 0.5, 0.7
    inter = pa + pb - pu
    pab = inter / pb
    return ("0.2", f"{pab:.12f}", abs(pab - 0.2) < 1e-12)


def q20_integrating_factor():
    """IF = exp(int (1-2x)/x^2 dx) = x^-2 e^(-1/x); verify d(IF)/dx = IF * P(x)."""
    P = lambda x: (1 - 2 * x) / x ** 2
    IF = lambda x: x ** -2 * math.exp(-1 / x)
    h = 1e-6
    ok = True
    for x in (0.7, 1.3, 2.4):
        d = (IF(x + h) - IF(x - h)) / (2 * h)
        ok = ok and abs(d - IF(x) * P(x)) < 1e-5 * max(1.0, abs(d))
    return ("IF = x^-2 e^(-1/x)", "IF'/IF = (1-2x)/x^2 at 3 sampled points", ok)


def determinant(A):
    """Determinant by cofactor expansion (tiny matrices only)."""
    n = len(A)
    if n == 1:
        return A[0][0]
    if n == 2:
        return A[0][0] * A[1][1] - A[0][1] * A[1][0]
    total = A[0][0] * 0  # exact zero of the same type
    for j in range(n):
        minor = [row[:j] + row[j + 1:] for row in A[1:]]
        total += ((-1) ** j) * A[0][j] * determinant(minor)
    return total


def dot(u, v):
    return sum(a * b for a, b in zip(u, v))


CHECKS = {
    1: q1_skew_even_order_perfect_square,
    3: q3_unit_vectors_sum_zero,
    5: q5_difference_quotient,
    6: q6_simpson_two_subintervals,
    7: q7_newton_raphson_root,
    8: q8_trapezoidal_five_ordinates,
    11: q11_exact_differential,
    13: q13_particular_integral,
    16: q16_two_heads_in_four,
    19: q19_conditional_probability,
    20: q20_integrating_factor,
}

NOT_COMPUTABLE = {
    2: "the corpus options contain no correct option for general n; check the printed page",
    4: "definitional: i(jxk) + j(kxi) + k(ixj) = 1 + 1 + 1",
    9: "operation count is a quoted result, not a computable quantity here",
    10: "order/degree by inspection after clearing the radical",
    12: "complementary function from the auxiliary roots",
    14: "Euler homogeneity, degree 2",
    15: "implicit differentiation of F with three arguments",
    17: "the corpus stem and option (A) disagree by a factor of 1/2 in the exponent; check the page",
    18: "excluded: the corpus stem is a substituted example",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-q", "--question", type=int)
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    if args.list:
        for q in range(1, 21):
            kind = "COMPUTABLE" if q in CHECKS else "NOT-COMPUTABLE"
            print(f"Q{q:<3} {kind:<16} {NOT_COMPUTABLE.get(q, '')}")
        return 0

    targets = [args.question] if args.question else sorted(CHECKS)
    failures = 0
    for q in targets:
        if q not in CHECKS:
            print(f"Q{q}: no numeric check ({NOT_COMPUTABLE.get(q, 'not applicable')})")
            continue
        expected, observed, ok = CHECKS[q]()
        status = "PASS" if ok else "FAIL"
        if not ok:
            failures += 1
        print(f"Q{q}: {status}  expected {expected}  |  observed {observed}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
