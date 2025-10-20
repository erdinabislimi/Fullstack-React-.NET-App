using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Security.Cryptography;

public class PasswordService
{
    public string HashPassword(string password)
    {
        byte[] salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA512,
            iterationCount: 10000,
            numBytesRequested: 32));

        string combinedHash = $"{Convert.ToBase64String(salt)}:{hashedPassword}";
        return combinedHash;
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        try
        {
            string[] hashParts = hashedPassword.Split(':');
            byte[] salt = Convert.FromBase64String(hashParts[0]);
            string storedHash = hashParts[1];

            string computedHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 10000,
                numBytesRequested: 32));

            return storedHash.Equals(computedHash);
        }
        catch
        {
            return false;
        }
    }
}
